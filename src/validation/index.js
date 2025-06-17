export const validation = (obj) => {
  if (obj.oldPassword === "") {
    return {
      target: "oldPassword",
      message: "Eski parolni kiriting !",
    };
  }
  if (obj.newPassword === "") {
    return {
      target: "newPassword",
      message: "Yangi parolni kiriting !",
    };
  }
  if (obj.confirmPassword === "") {
    return {
      target: "confirmPassword",
      message: "Yangi parolni tasdiqlang !",
    };
  }
  if (obj.newPassword !== obj.confirmPassword) {
    return {
      target: "newPassword",
      message: "Parolni tekshiring !",
    };
  }
  return false;
};
