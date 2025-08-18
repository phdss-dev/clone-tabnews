function status(req, res) {
  res.status(200).json({
    status: "Ok",
    timestamp: new Date().toISOString(),
  });
}

export default status;
