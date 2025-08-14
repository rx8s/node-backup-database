const { upload_to_ftp } = require("../upload/upload_ftp.js");
const ftp = require("basic-ftp");

jest.mock("basic-ftp");

describe("upload_to_ftp", () => {
  it("should call uploadFrom for each file", async () => {
    const files = ["file1.sql", "file2.bak"];
    const mockUploadFrom = jest.fn();
    ftp.Client.mockImplementation(() => ({
      access: jest.fn(),
      uploadFrom: mockUploadFrom,
      close: jest.fn(),
      ftp: { verbose: true }
    }));

    await upload_to_ftp(files);

    expect(mockUploadFrom).toHaveBeenCalledTimes(files.length);
  });
});
