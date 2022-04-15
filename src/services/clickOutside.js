/** Dispatch event on click outside of node */
export function clickOutside(node) {
  
  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented && event.target.id !== "remove-icon" &&
                !event.target.classList.contains("removable") &&
                !(
                    event.target.classList.length > 0 &&
                    event.target.classList[0].startsWith("s-")
                )) {
      node.dispatchEvent(
        new CustomEvent('click_outside', node)
      )
    }
  }

	document.addEventListener('click', handleClick, true);
  
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
	}
}