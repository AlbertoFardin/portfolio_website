/* eslint-disable @typescript-eslint/no-unused-vars */
S3Upload.prototype.server = "";
S3Upload.prototype.signingUrl = "/sign-s3";
S3Upload.prototype.signingUrlMethod = "GET";
S3Upload.prototype.successResponses = [200, 201];
S3Upload.prototype.fileElement = null;
S3Upload.prototype.files = null;

S3Upload.prototype.onFinishS3Put = (signResult) => {
  // console.log("base.onFinishS3Put()", signResult.publicUrl);
};

S3Upload.prototype.preprocess = (file, next) => {
  // console.log("base.preprocess()", file);
  return next(file);
};

S3Upload.prototype.onProgress = (percent, status) => {
  // console.log("base.onProgress()", percent, status);
};

S3Upload.prototype.onError = (status) => {
  // console.log("base.onError()", status);
};

S3Upload.prototype.onSignedUrl = (result) => {
  // console.log(result);
};

S3Upload.prototype.scrubFilename = (filename) =>
  filename.replace(/[^\w\d_\-\.]+/gi, "");

function S3Upload(options) {
  if (options === null) {
    options = {};
  }
  for (const option in options) {
    if (options.hasOwnProperty(option)) {
      this[option] = options[option];
    }
  }
  const { file, mimeType } = options;
  this.handleFileSelect(file, mimeType);
}

S3Upload.prototype.handleFileSelect = function (file, mimeType) {
  const result = [];
  this.preprocess(file, (processedFile) => {
    this.onProgress(0, "Waiting", processedFile);
    result.push(this.uploadFile(processedFile, mimeType));
    return result;
  });
};

S3Upload.prototype.createCORSRequest = (method, url, opts) => {
  const opts1 = opts || {};
  let xhr = new XMLHttpRequest();

  if (xhr.withCredentials !== null) {
    xhr.open(method, url, true);
    if (opts1.withCredentials !== null) {
      xhr.withCredentials = opts1.withCredentials;
    }
  } else {
    xhr = null;
  }
  return xhr;
};

S3Upload.prototype.executeOnSignedUrl = function (file, mimeType, callback) {
  const fileName = this.scrubFilename(file.name);
  let queryString = `?objectName=${fileName}&contentType=${encodeURIComponent(
    mimeType
  )}`;
  if (this.s3path) {
    queryString += `&path=${encodeURIComponent(this.s3path)}`;
  }
  if (this.signingUrlQueryParams) {
    const signingUrlQueryParams =
      typeof this.signingUrlQueryParams === "function"
        ? this.signingUrlQueryParams()
        : this.signingUrlQueryParams;
    Object.keys(signingUrlQueryParams).forEach((key) => {
      const val = signingUrlQueryParams[key];
      queryString += `&${key}=${val}`;
    });
  }
  const xhr = this.createCORSRequest(
    this.signingUrlMethod,
    this.server + this.signingUrl + queryString,
    { withCredentials: this.signingUrlWithCredentials }
  );
  if (this.signingUrlHeaders) {
    const signingUrlHeaders =
      typeof this.signingUrlHeaders === "function"
        ? this.signingUrlHeaders()
        : this.signingUrlHeaders;
    Object.keys(signingUrlHeaders).forEach((key) => {
      const val = signingUrlHeaders[key];
      xhr.setRequestHeader(key, val);
    });
  }
  if (xhr.overrideMimeType)
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
  xhr.onreadystatechange = function () {
    if (
      xhr.readyState === 4 &&
      this.successResponses.indexOf(xhr.status) >= 0
    ) {
      let result;
      try {
        result = JSON.parse(xhr.responseText);
        this.onSignedUrl(result);
      } catch (error) {
        this.onError("Invalid response from server", file);
        return false;
      }
      return callback(result);
    }
    if (xhr.readyState === 4 && this.successResponses.indexOf(xhr.status) < 0) {
      return this.onError(
        `Could not contact request signing server. Status = ${xhr.status}`,
        file
      );
    }
  }.bind(this);
  return xhr.send();
};

S3Upload.prototype.uploadToS3 = function (file, mimeType, signResult) {
  const xhr = this.createCORSRequest("PUT", signResult.signedUrl);
  if (!xhr) {
    this.onError("CORS not supported", file);
  } else {
    xhr.onload = function () {
      if (this.successResponses.indexOf(xhr.status) >= 0) {
        this.onProgress(100, "Upload completed", file);
        return this.onFinishS3Put(signResult, file);
      }
      return this.onError(`Upload error: ${xhr.status}`, file);
    }.bind(this);
    xhr.onerror = function () {
      return this.onError("XHR error", file);
    }.bind(this);
    xhr.upload.onprogress = function (e) {
      let percentLoaded;
      if (e.lengthComputable) {
        percentLoaded = Math.round((e.loaded / e.total) * 100);
        return this.onProgress(
          percentLoaded,
          percentLoaded === 100 ? "Finalizing" : "Uploading",
          file
        );
      }
    }.bind(this);
  }
  xhr.setRequestHeader("Content-Type", mimeType);
  if (this.contentDisposition) {
    let disposition = this.contentDisposition;
    if (disposition === "auto") {
      disposition = "inline";
    }

    const fileName = this.scrubFilename(file.name);
    xhr.setRequestHeader(
      "Content-Disposition",
      `${disposition}; filename="${fileName}"`
    );
  }
  if (signResult.headers) {
    const signResultHeaders = signResult.headers;
    Object.keys(signResultHeaders).forEach((key) => {
      const val = signResultHeaders[key];
      xhr.setRequestHeader(key, val);
    });
  }
  if (this.uploadRequestHeaders) {
    const { uploadRequestHeaders } = this;
    Object.keys(uploadRequestHeaders).forEach((key) => {
      const val = uploadRequestHeaders[key];
      xhr.setRequestHeader(key, val);
    });
  } else {
    xhr.setRequestHeader("x-amz-acl", "public-read");
  }
  this.httprequest = xhr;
  return xhr.send(file);
};

S3Upload.prototype.uploadFile = function (file, mimeType) {
  const uploadToS3Callback = this.uploadToS3.bind(this, file, mimeType);

  if (this.getSignedUrl) return this.getSignedUrl(file, uploadToS3Callback);
  return this.executeOnSignedUrl(file, mimeType, uploadToS3Callback);
};

S3Upload.prototype.abortUpload = function () {
  if (this.httprequest) this.httprequest.abort();
  this.onAbort();
};

export default S3Upload;
