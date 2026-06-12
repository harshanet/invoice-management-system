const sinon = require('sinon');

// Builds a fake Express `res` whose `.status()` is chainable (returns `res`)
// so controller calls like `res.status(404).json(...)` work, and both
// `status` and `json` are sinon stubs we can assert against.
const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

module.exports = { mockRes };
