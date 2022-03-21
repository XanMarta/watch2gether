//header for authorization. Needs to change later.
const getHeaders = {
  headers: {
    accesstoken: localStorage.getItem("accesstoken"),
  },
};

export { getHeaders }