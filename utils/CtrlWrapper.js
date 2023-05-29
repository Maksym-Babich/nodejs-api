const CtrlWrapper = (ctrl) => {
  const newFunc = async (req, res, next) => {
    try {
      await ctrl(req, res);
    } catch (error) {
      next(error);
    }
  };
  return newFunc;
};

module.exports = CtrlWrapper;
