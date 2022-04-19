import IFileStatus from "../IFileStatus";
import itemsUpdate from "../McrUploads/itemsUpdate";

describe("MultiUploads - itemsUpdate with numParallelUpload (default to 1)", () => {
  test("Completed", () => {
    const res = [
      {
        id: "1",
        file: { type: "image", name: "a" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { type: "image", name: "b" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "3",
        file: { type: "image", name: "c" } as File,
        status: IFileStatus.Error,
        sessionUploadId: "123",
      },
      {
        id: "4",
        file: { type: "image", name: "d" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "5",
        file: { type: "image", name: "e" } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
    ];
    expect(
      itemsUpdate({
        items: [
          {
            id: "1",
            file: { type: "image", name: "a" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { type: "image", name: "b" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "3",
            file: { type: "image", name: "c" } as File,
            status: IFileStatus.Error,
            sessionUploadId: "123",
          },
          {
            id: "4",
            file: { type: "image", name: "d" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "5",
            file: { type: "image", name: "e" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        ifile: {
          id: "4",
          sessionUploadId: "123",
          file: { type: "image", name: "d" } as File,
          tooltip: "tooltip",
          status: IFileStatus.Uploading,
        },
      })
    ).toEqual(res);
  });

  test("Error", () => {
    const res = [
      {
        id: "1",
        file: { type: "image", name: "a" } as File,
        status: IFileStatus.Error,
        tooltip: "tooltip",
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { type: "image", name: "b" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "3",
        file: { type: "image", name: "c" } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
    ];
    expect(
      itemsUpdate({
        items: [
          {
            id: "1",
            file: { type: "image", name: "a" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { type: "image", name: "b" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
          {
            id: "3",
            file: { type: "image", name: "c" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        ifile: {
          id: "1",
          sessionUploadId: "123",
          file: { type: "image", name: "a" } as File,
          tooltip: "tooltip",
          status: IFileStatus.Error,
        },
      })
    ).toEqual(res);
  });
});

describe("MultiUploads - itemsUpdate with numParallelUpload (default to 2)", () => {
  test("Completed", () => {
    const res = [
      {
        id: "1",
        file: { type: "image", name: "a" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },

      {
        id: "2",
        file: { type: "image", name: "b" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "3",
        file: { type: "image", name: "c" } as File,
        status: IFileStatus.Error,
        sessionUploadId: "123",
      },
      {
        id: "4",
        file: { type: "image", name: "d" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "5",
        file: { type: "image", name: "e" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
    ];
    expect(
      itemsUpdate({
        items: [
          {
            id: "1",
            file: { type: "image", name: "a" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { type: "image", name: "b" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "3",
            file: { type: "image", name: "c" } as File,
            status: IFileStatus.Error,
            sessionUploadId: "123",
          },
          {
            id: "4",
            file: { type: "image", name: "d" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
          {
            id: "5",
            file: { type: "image", name: "e" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        ifile: {
          id: "2",
          sessionUploadId: "123",
          file: { type: "image", name: "b" } as File,
          tooltip: "tooltip",
          status: IFileStatus.Completed,
        },
        numParallelUpload: 2,
      })
    ).toEqual(res);
  });

  test("Completed with two in Uploading", () => {
    const res = [
      {
        id: "1",
        file: { type: "image", name: "a" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },

      {
        id: "2",
        file: { type: "image", name: "b" } as File,
        status: IFileStatus.Completed,
        sessionUploadId: "123",
      },
      {
        id: "3",
        file: { type: "image", name: "c" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "4",
        file: { type: "image", name: "d" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "5",
        file: { type: "image", name: "e" } as File,
        status: IFileStatus.Waiting,
        sessionUploadId: "123",
      },
    ];
    expect(res).toEqual(
      itemsUpdate({
        items: [
          {
            id: "1",
            file: { type: "image", name: "a" } as File,
            status: IFileStatus.Completed,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { type: "image", name: "b" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "3",
            file: { type: "image", name: "c" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "4",
            file: { type: "image", name: "d" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
          {
            id: "5",
            file: { type: "image", name: "e" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        ifile: {
          id: "2",
          sessionUploadId: "123",
          file: { type: "image", name: "b" } as File,
          tooltip: "tooltip",
          status: IFileStatus.Completed,
        },
        numParallelUpload: 2,
      })
    );
  });

  test("Error", () => {
    const res = [
      {
        id: "1",
        file: { type: "image", name: "a" } as File,
        status: IFileStatus.Error,
        tooltip: "tooltip",
        sessionUploadId: "123",
      },
      {
        id: "2",
        file: { type: "image", name: "b" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
      {
        id: "3",
        file: { type: "image", name: "c" } as File,
        status: IFileStatus.Uploading,
        sessionUploadId: "123",
      },
    ];
    expect(
      itemsUpdate({
        items: [
          {
            id: "1",
            file: { type: "image", name: "a" } as File,
            status: IFileStatus.Uploading,
            sessionUploadId: "123",
          },
          {
            id: "2",
            file: { type: "image", name: "b" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
          {
            id: "3",
            file: { type: "image", name: "c" } as File,
            status: IFileStatus.Waiting,
            sessionUploadId: "123",
          },
        ],
        ifile: {
          id: "1",
          sessionUploadId: "123",
          file: { type: "image", name: "a" } as File,
          tooltip: "tooltip",
          status: IFileStatus.Error,
        },

        numParallelUpload: 2,
      })
    ).toEqual(res);
  });
});
