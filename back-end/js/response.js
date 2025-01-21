
// untuk custom format pada response
const response = (status, data, message, res) => {
    res.status(status).json({ status, data, message });
};


// const response = (statusCode, data, message, res) => {
//     res.status(statusCode).json([
//         {
//             data,
//             message,
//             metadata: {
//                 prev: "",
//                 next: "",
//                 current: ""
//             }
//         }
//     ])
// }

export default response