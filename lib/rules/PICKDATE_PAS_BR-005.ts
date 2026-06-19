import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intended behavior is to update a display label or
// log entry reflecting the selected calendar date formatted as 'Month, Year'
// (e.g. "January, 2024"). Confirm which Parts record(s) should be stamped with
// this derived period string, and whether 'description' is the correct field to
// store it, or if a separate audit/log mechanism is preferred.

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  updatedCount: number;
  formattedPeriod: string;
}> {
  // TODO(rnc): verify — the original Delphi handler sets TitleLabel.Caption to
  // FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate) on a calendar date-change
  // event. A human must confirm: (1) which date to use as the "selected" date in
  // this server-side context, (2) which Parts records are in scope, and (3) whether
  // writing the formatted period into Parts.description is the correct mapping.

  // Simulate the "selected calendar date" — in production this should come from
  // a request parameter, session, or caller argument.
  const selectedDate = new Date();

  // Replicate FormatDateTime('MMMM, YYYY', ...) — e.g. "January, 2024"
  const formattedPeriod = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  // toLocaleDateString returns "January 2024" (space); replace space with ", "
  // to match the Delphi 'MMMM, YYYY' pattern exactly.
  const periodLabel = formattedPeriod.replace(/\s+/, ', ');

  // Derive a numeric year+month key to identify "active" parts for this period.
  // Here we treat parts whose description already contains the prior period label
  // as candidates to be refreshed, or — if none exist — we update all parts.
  // A human must confirm the correct filter logic.
  const existingParts = await prisma.parts.findMany({
    select: { id: true, description: true },
  });

  const candidateIds: number[] = existingParts
    .filter((p) => {
      // Include parts whose description is blank/null or already holds a
      // period-style label (heuristic: matches "Month, YYYY" pattern).
      if (!p.description) return true;
      return /^[A-Za-z]+,\s\d{4}$/.test(p.description.trim());
    })
    .map((p) => p.id);

  if (candidateIds.length === 0) {
    return { updatedCount: 0, formattedPeriod: periodLabel };
  }

  const result = await prisma.$transaction(async (tx) => {
    // Stamp each candidate Part's description with the formatted period label,
    // mirroring the caption update the Delphi TitleLabel received.
    const updateResults = await Promise.all(
      candidateIds.map((partId) =>
        tx.parts.update({
          where: { id: partId },
          data: {
            description: periodLabel,
          },
        })
      )
    );

    return updateResults;
  });

  return {
    updatedCount: result.length,
    formattedPeriod: periodLabel,
  };
}