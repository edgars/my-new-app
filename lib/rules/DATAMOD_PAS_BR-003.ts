export async function setDatabaseAlias(aliasName: string): Promise<{ success: boolean; aliasName: string }> {
  // TODO(rnc): verify that aliasName corresponds to a valid, whitelisted database alias/connection string
  // and that switching aliases mid-session does not corrupt in-flight transactions or active Prisma connections;
  // also confirm that the Nextcust.newcust field is updated/re-seeded after the alias switch if it holds
  // environment-specific data, and that proper auth checks prevent arbitrary alias injection.

  if (!aliasName || typeof aliasName !== "string" || aliasName.trim() === "") {
    throw new Error("Invalid aliasName: must be a non-empty string.");
  }

  const sanitizedAlias = aliasName.trim();

  const ALLOWED_ALIASES: string[] = (process.env.ALLOWED_DB_ALIASES ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  if (ALLOWED_ALIASES.length > 0 && !ALLOWED_ALIASES.includes(sanitizedAlias)) {
    throw new Error(`Alias "${sanitizedAlias}" is not in the list of permitted database aliases.`);
  }

  await prisma.$transaction(async (tx) => {
    // Close equivalent: disconnect the current client before switching
    await prisma.$disconnect();

    // Persist the new alias selection against the Nextcust record so that
    // subsequent requests know which alias is active (mirrors AliasName assignment)
    await tx.nextcust.updateMany({
      data: {
        newcust: sanitizedAlias,
      },
    });

    // Open equivalent: reconnect with the new alias recorded
    // Actual Prisma datasource URL switching must be handled via
    // environment variable or dynamic datasource configuration at startup;
    // this write signals the intent and allows middleware to re-initialise.
  });

  // Re-connect after the alias update (mirrors Database.Open)
  await prisma.$connect();

  return { success: true, aliasName: sanitizedAlias };
}