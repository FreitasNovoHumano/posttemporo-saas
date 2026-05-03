const prisma = require("../src/lib/prisma");

async function main() {
  // 🔐 Permissões
  const permissions = [
    "CREATE_POST",
    "UPDATE_POST",
    "DELETE_POST",
    "APPROVE_POST",
    "VIEW_DASHBOARD",
  ];

  const createdPermissions = {};

  for (const name of permissions) {
    const perm = await prisma.permission.upsert({
      // ✅ usa o nome dinâmico
      where: { name },
      update: {},
      create: { name },
    });

    createdPermissions[name] = perm;
  }

  // 👑 ADMIN
  const admin = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  // ✍️ EDITOR
  const editor = await prisma.role.upsert({
    where: { name: "EDITOR" },
    update: {},
    create: { name: "EDITOR" },
  });

  // 👀 VIEWER
  const viewer = await prisma.role.upsert({
    where: { name: "VIEWER" },
    update: {},
    create: { name: "VIEWER" },
  });

  // 🔗 ADMIN → todas permissões
  for (const perm of Object.values(createdPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: admin.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: admin.id,
        permissionId: perm.id,
      },
    });
  }

  // 🔗 EDITOR
  const editorPerms = ["CREATE_POST", "UPDATE_POST", "VIEW_DASHBOARD"];

  for (const name of editorPerms) {
    await prisma.rolePermission.upsert({
      // 🔥 evita duplicação (melhor que create)
      where: {
        roleId_permissionId: {
          roleId: editor.id,
          permissionId: createdPermissions[name].id,
        },
      },
      update: {},
      create: {
        roleId: editor.id,
        permissionId: createdPermissions[name].id,
      },
    });
  }

  // 🔗 VIEWER
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: viewer.id,
        permissionId: createdPermissions.VIEW_DASHBOARD.id,
      },
    },
    update: {},
    create: {
      roleId: viewer.id,
      permissionId: createdPermissions.VIEW_DASHBOARD.id,
    },
  });

  console.log("🌱 Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });