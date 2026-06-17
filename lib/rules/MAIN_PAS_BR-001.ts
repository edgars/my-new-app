async function GetDateOrder(constDateFormat: string): Promise<string> {
  // TODO(rnc): verify that constDateFormat values map correctly to the expected TDateOrder enum/type (e.g., 'DMY', 'MDY', 'YMD'), and confirm the date format strings used here match those stored or expected by the Nextcust.newcust field consumers

  let dateOrder: string;

  const normalizedFormat = constDateFormat.toUpperCase().trim();

  if (
    normalizedFormat.startsWith("D") &&
    normalizedFormat.includes("M") &&
    normalizedFormat.includes("Y")
  ) {
    const dIndex = normalizedFormat.indexOf("D");
    const mIndex = normalizedFormat.indexOf("M");
    const yIndex = normalizedFormat.indexOf("Y");

    if (dIndex < mIndex && mIndex < yIndex) {
      dateOrder = "DMY";
    } else if (mIndex < dIndex && dIndex < yIndex) {
      dateOrder = "MDY";
    } else if (yIndex < mIndex && mIndex < dIndex) {
      dateOrder = "YMD";
    } else if (yIndex < dIndex && dIndex < mIndex) {
      dateOrder = "YDM";
    } else if (mIndex < yIndex && yIndex < dIndex) {
      dateOrder = "MYD";
    } else {
      dateOrder = "DMY";
    }
  } else if (normalizedFormat.startsWith("M")) {
    dateOrder = "MDY";
  } else if (normalizedFormat.startsWith("Y")) {
    dateOrder = "YMD";
  } else {
    dateOrder = "DMY";
  }

  await prisma.$transaction(async (tx) => {
    const existingCust = await tx.nextcust.findFirst({
      where: {
        newcust: constDateFormat,
      },
    });

    if (existingCust) {
      await tx.nextcust.update({
        where: { id: existingCust.id },
        data: {
          newcust: dateOrder,
        },
      });
    } else {
      await tx.nextcust.create({
        data: {
          newcust: dateOrder,
        },
      });
    }
  });

  return dateOrder;
}