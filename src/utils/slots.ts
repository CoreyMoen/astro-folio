type Slots = {
  has(name: string): boolean;
  render(name: string): Promise<string>;
};

/**
 * A slot's rendered HTML, trimmed, or `""` when it renders nothing.
 *
 * `slots.has` is not sufficient on its own: a slot holding an expression that
 * renders nothing — an empty array's `map`, say — still counts as provided.
 */
export async function slotContent(
  slots: Slots,
  name = "default",
): Promise<string> {
  return slots.has(name) ? (await slots.render(name)).trim() : "";
}
