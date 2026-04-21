router.get(
  "/timeline",
  auth,
  company,
  async (req, res) => {
    const data = await timelineService.getTimeline(req.companyId);
    res.json(data);
  }
);