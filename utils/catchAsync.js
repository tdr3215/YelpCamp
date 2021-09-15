module.exports = (func) => {
  return (req, res, next) => {
    //returns a new func that has the inputed function executed
    func(req, res, next).catch(next); //catches any errors and passes to the error handler
  };
};
