type Message = {
  type: "audio" | "text";
  sender: "teacher" | "student";
  content: string | Blob;
};
