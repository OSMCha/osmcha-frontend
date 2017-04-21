export function dispatchEvent(
  messageId: string,
  payLoad: Object,
  target: ?Object,
) {
  const event = new CustomEvent(messageId, {
    detail: payLoad,
  });
  (target || document.body).dispatchEvent(event);
}
