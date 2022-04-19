import IFileStatus from "../IFileStatus";
import itemsAddAndUploading from "../McrUploads/itemsAddAndUploading";

const maxSize = () => 300;

describe("MultiUploads - itemsAdd", () => {
  test("add while uploading", () => {
    const res = [
      {
        id: "1",
        file: { name: "a" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { name: "b" } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
      {
        id: "pippo_undefined_100_undefined_undefined",
        file: { name: "pippo", size: 100 } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
      {
        id: "pluto_undefined_200_undefined_undefined",
        file: { name: "pluto", size: 200 } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
    ];
    expect(res).toEqual(
      itemsAddAndUploading({
        items: [
          {
            id: "1",
            file: { name: "a" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { name: "b" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        filesToAdd: [
          {
            id: "pippo_undefined_100_undefined_undefined",
            sessionUploadId: "123",
            status: IFileStatus.Waiting,
            file: { name: "pippo", size: 100 } as File,
          },
          {
            id: "pluto_undefined_200_undefined_undefined",
            sessionUploadId: "123",
            status: IFileStatus.Waiting,
            file: { name: "pluto", size: 200 } as File,
          },
        ],
        maxSize,
      })
    );
  });

  test("add while NO uploading", () => {
    const res = [
      {
        id: "1",
        file: { name: "a" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { name: "b" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "pippo_undefined_100_undefined_undefined",
        file: { name: "pippo", size: 100 } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "pluto_undefined_200_undefined_undefined",
        file: { name: "pluto", size: 200 } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
    ];
    expect(res).toEqual(
      itemsAddAndUploading({
        items: [
          {
            id: "1",
            file: { name: "a" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { name: "b" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
        ],
        filesToAdd: [
          {
            id: "pippo_undefined_100_undefined_undefined",
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
            file: { name: "pippo", size: 100 } as File,
          },
          {
            id: "pluto_undefined_200_undefined_undefined",
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
            file: { name: "pluto", size: 200 } as File,
          },
        ],
        maxSize,
      })
    );
  });

  test("add while 1 uploading and numParallelUpload is 2", () => {
    const res = [
      {
        id: "1",
        file: { name: "a" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { name: "b" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "pippo_undefined_100_undefined_undefined",
        file: { name: "pippo", size: 100 } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "pluto_undefined_200_undefined_undefined",
        file: { name: "pluto", size: 200 } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
    ];
    expect(res).toEqual(
      itemsAddAndUploading({
        items: [
          {
            id: "1",
            file: { name: "a" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { name: "b" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
        ],
        filesToAdd: [
          {
            id: "pippo_undefined_100_undefined_undefined",
            file: { name: "pippo", size: 100 } as File,
            sessionUploadId: "123",
            status: IFileStatus.Uploading,
          },
          {
            id: "pluto_undefined_200_undefined_undefined",
            file: { name: "pluto", size: 200 } as File,
            sessionUploadId: "123",
            status: IFileStatus.Waiting,
          },
        ],
        maxSize,
        numParallelUpload: 2,
      })
    );
  });

  test("add while 0 uploading and numParallelUpload is 2", () => {
    const res = [
      {
        id: "1",
        file: { name: "a" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { name: "b" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "pippo_undefined_100_undefined_undefined",
        file: { name: "pippo", size: 100 } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "pluto_undefined_200_undefined_undefined",
        file: { name: "pluto", size: 200 } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
    ];
    expect(res).toEqual(
      itemsAddAndUploading({
        items: [
          {
            id: "1",
            file: { name: "a" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { name: "b" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
        ],
        filesToAdd: [
          {
            id: "pippo_undefined_100_undefined_undefined",
            file: { name: "pippo", size: 100 } as File,
            sessionUploadId: "123",
            status: IFileStatus.Uploading,
          },
          {
            id: "pluto_undefined_200_undefined_undefined",
            file: { name: "pluto", size: 200 } as File,
            sessionUploadId: "123",
            status: IFileStatus.Uploading,
          },
        ],
        maxSize,
        numParallelUpload: 2,
      })
    );
  });

  test("exceed the max size limit", () => {
    const res = [
      {
        id: "1",
        file: { name: "a" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { name: "b" } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
      {
        id: "pippo_undefined_500_undefined_undefined",
        file: { name: "pippo", size: 500 } as File,
        status: IFileStatus.Error,
        sessionUploadId: "123",
        tooltip: `The 500 B size of the file is greater than the maximum allowed (300 B)`,
      },
    ];
    expect(res).toEqual(
      itemsAddAndUploading({
        items: [
          {
            id: "1",
            file: { name: "a" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { name: "b" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        filesToAdd: [
          {
            id: "pippo_undefined_500_undefined_undefined",
            status: IFileStatus.Error,
            file: { name: "pippo", size: 500 } as File,
            sessionUploadId: "123",
          },
        ],
        maxSize,
      })
    );
  });
});
