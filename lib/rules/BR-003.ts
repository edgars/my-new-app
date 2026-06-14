async function setDatabaseAlias(aliasName: string) {
  // TODO(rnc): verify that the aliasName corresponds to a valid database connection string and that the database is accessible before attempting to switch
  const transaction = await prisma.$transaction(async (tx) => {
    // In Prisma/Next.js context, we can't directly change database connections at runtime like in Delphi
    // This would typically be handled by switching between different Prisma clients or connection pools
    // For demonstration, we'll just validate the alias exists in a config table
    
    const dbConfig = await tx.databaseConfig.findUnique({
      where: { aliasName }
    });
    
    if (!dbConfig) {
      throw new Error(`Database alias '${aliasName}' not found`);
    }
    
    // Update session/connection state to use this alias
    await tx.activeConnection.update({
      where: { id: 'current' },
      data: { 
        currentAlias: aliasName,
        lastSwitched: new Date()
      }
    });
    
    return { success: true, alias: aliasName };
  });
  
  return transaction;
}