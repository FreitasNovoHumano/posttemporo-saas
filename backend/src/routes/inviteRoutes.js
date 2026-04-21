router.post("/invite", auth, company, role("ADMIN"), async (req, res) => {
  const invite = await inviteService.createInvite({
    email: req.body.email,
    companyId: req.companyId,
    role: req.body.role,
  });

  res.json(invite);
});

router.post("/invite/accept", auth, async (req, res) => {
  await inviteService.acceptInvite({
    token: req.body.token,
    userId: req.user.userId,
  });

  res.json({ success: true });
});