export async function handleCustGridEnter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that MastData.CustMasterSrc is properly set as ActiveSource
  // and that grid options are correctly updated in the UI state
  const prisma = new PrismaClient();
  
  try {
    await prisma.$transaction(async (tx) => {
      // Simulate setting active source to customer master
      await tx.systemSetting.upsert({
        where: { key: 'ActiveSource' },
        update: { value: 'CustMasterSrc', updatedAt: new Date() },
        create: { key: 'ActiveSource', value: 'CustMasterSrc', createdAt: new Date() }
      });

      // Update customer grid options to always show selection
      await tx.gridSetting.upsert({
        where: { gridName: 'CustGrid' },
        update: { 
          options: { push: ['dgAlwaysShowSelection'] },
          updatedAt: new Date() 
        },
        create: { 
          gridName: 'CustGrid', 
          options: ['dgAlwaysShowSelection'],
          createdAt: new Date()
        }
      });

      // Update orders grid options to remove always show selection
      const ordersGridSettings = await tx.gridSetting.findUnique({
        where: { gridName: 'OrdersGrid' }
      });
      
      if (ordersGridSettings) {
        const updatedOptions = (ordersGridSettings.options as string[]).filter(
          opt => opt !== 'dgAlwaysShowSelection'
        );
        await tx.gridSetting.update({
          where: { gridName: 'OrdersGrid' },
          data: { 
            options: updatedOptions,
            updatedAt: new Date()
          }
        });
      } else {
        await tx.gridSetting.create({
          data: {
            gridName: 'OrdersGrid',
            options: [],
            createdAt: new Date()
          }
        });
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to handle CustGrid enter event' });
  } finally {
    await prisma.$disconnect();
  }
}