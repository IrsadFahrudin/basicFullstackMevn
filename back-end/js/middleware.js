export const isAdmin = (req, res, next) => {
    const userRole = req.headers.role;
    console.log("Role di middleware:", userRole);

    if (userRole === "1") {
        return next();
    }
    return res.status(403).json({ success: false, message: "Akses hanya untuk admin." });
};

export const isUser = (req, res, next) => {
    const userRole = req.headers.role;
    console.log("Role di middleware:", userRole);

    if (userRole === "2") {
        return next();
    }
    return res.status(403).json({ success: false, message: "Akses hanya untuk user." });
};
