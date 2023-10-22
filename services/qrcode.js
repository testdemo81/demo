import qrcode from "qrcode";

export const qrCode_Function = ({ data = "" } = {}) => {
    var opts = {
        errorCorrectionLevel: "H",
        type: "image/jpeg",
        quality: 0.3,
        margin: 1
    };
    const QRCODE = qrcode.toDataURL(data, opts);
    return QRCODE;
};
