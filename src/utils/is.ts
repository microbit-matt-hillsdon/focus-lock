const isElementHidden = (computedStyle: CSSStyleDeclaration): boolean => {
  if (!computedStyle || !computedStyle.getPropertyValue) {
    return false;
  }
  return (
    computedStyle.getPropertyValue('display') === 'none' || computedStyle.getPropertyValue('visibility') === 'hidden'
  );
};

const isVisible = (node: HTMLElement | undefined): boolean =>
  !node ||
  // @ts-ignore
  node === document ||
  (node && node.nodeType === Node.DOCUMENT_NODE) ||
  (!isElementHidden(window.getComputedStyle(node, null)) &&
    isVisible(
      node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ? (node.parentNode as any).host
        : node.parentNode
    ));

export type VisibilityCache = Map<HTMLElement | undefined, boolean>;

export const isVisibleCached = (node: HTMLElement | undefined, visibilityCache: VisibilityCache): boolean => {
  const cached = visibilityCache.get(node)
  if (cached !== undefined) {
    return cached;
  }
  const result = isVisible(node);
  visibilityCache.set(node, result)
  return result;
};

export const notHiddenInput = (node: HTMLInputElement) =>
  !((node.tagName === 'INPUT' || node.tagName === 'BUTTON') && (node.type === 'hidden' || node.disabled));
export const isGuard = (node: HTMLElement): boolean => Boolean(node && node.dataset && node.dataset.focusGuard);
export const isNotAGuard = (node: HTMLElement) => !isGuard(node);

export const isDefined = <T>(x: T | null | undefined): x is T => Boolean(x);
