export async function handleTransfer(event: any) {
  const { from, to, value } = event.args; // Use `value` for ERC-20, `tokenId` for ERC-721
  console.log(`Transfer: ${value} $TOURS from ${from} to ${to}`);
}
