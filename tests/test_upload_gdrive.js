const { upload_to_gdrive } = require("../upload/upload_gdrive.js");
const { google } = require("googleapis");
jest.mock("googleapis");

describe("upload_to_gdrive", () => {
  it("should call Google Drive API for each file", async () => {
    const files = ["file1.sql", "file2.bak"];
    const mockFilesCreate = jest.fn().mockResolvedValue({ id: "123" });
    google.drive.mockReturnValue({ files: { create: mockFilesCreate } });

    await upload_to_gdrive(files);

    expect(mockFilesCreate).toHaveBeenCalledTimes(files.length);
  });
});
