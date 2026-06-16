async function handlePartsFormShow() {
  // TODO(rnc): verify that this loads all parts records as expected and handles cases where no parts exist
  const parts = await prisma.parts.findMany({
    select: {
      partno: true,
      description: true,
      onhand: true,
      onorder: true,
      vendorno: true,
      cost: true,
      listprice: true,
      backord: true
    }
  });
  
  return { parts };
}