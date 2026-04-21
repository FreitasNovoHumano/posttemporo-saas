exports.success = (res, data, message = "OK") => {
  return res.json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, message = "Erro", status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  });
};