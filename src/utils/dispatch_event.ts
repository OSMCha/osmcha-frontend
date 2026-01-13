export function dispatchEvent(
  messageId: string,
  payLoad: any,
  target?: any | null
) {
  const event = new CustomEvent(messageId, {
    detail: payLoad,
  });
  (target || document.body).dispatchEvent(event);
}
