export function getHiddenProp(): string | null {
  const prefixes = ['webkit','moz','ms','o'];
  
  // if 'hidden' is natively supported just return it
  if ('hidden' in document) return 'hidden';
  
  // otherwise loop over all the known prefixes until we find one
  for (let i = 0; i < prefixes.length; i++) {
    if ((prefixes[i] + 'Hidden') in document) {
      return prefixes[i] + 'Hidden';
    }
  }

  // otherwise it's not supported
  return null;
}

export function isHidden(): boolean {
  var prop = getHiddenProp();
  if (!prop) return false;
  
  return (document as any)[prop] as boolean;
}

export function addVisibilityListener(callback: (isHidden: boolean) => void): void {
  const prop = getHiddenProp();
  if (!prop) {
    return;
  }
  const eventName = prop.replace(/[H|h]idden/,'') + 'visibilitychange';
  document.addEventListener(eventName, () => {
    callback(isHidden());
  });
}
