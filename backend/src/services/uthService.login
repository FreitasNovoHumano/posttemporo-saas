const membership = await prisma.membership.findFirst({
  where: {
    userId: user.id,
    companyId: selectedCompanyId, // 🔥 vem do frontend
  },
  include: {
    role: {
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    },
  },
});