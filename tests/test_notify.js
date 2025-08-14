const { notify } = require("../utils/notify.js");
const axios = require("axios");
jest.mock("axios");

describe("notify", () => {
  it("should send POST request", async () => {
    axios.post.mockResolvedValue({ status: 200 });
    await notify({
      message: "Test",
      startTime: new Date(),
      endTime: new Date(),
      pushUrl: "http://example.com"
    });
    expect(axios.post).toHaveBeenCalled();
  });
});
