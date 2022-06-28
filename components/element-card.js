class ElementCard extends HTMLElement {
  connectedCallback() {
    var nodeTypeName = this.processNodeName(this.attributes.nodeTypeName.value);

    //this.attachShadow({ mode: 'open' });

    this.innerHTML = `<div class="elementTitle">
    <span>${this.capitalize(nodeTypeName)}</span>
    </div>`;
  }

  processNodeName(nodeTypeName) {
    var stringStripChecker = 'node-';
    return nodeTypeName.includes(stringStripChecker)
      ? nodeTypeName.replace(stringStripChecker, '')
      : nodeTypeName;
  }

  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}

customElements.define('element-card', ElementCard);
