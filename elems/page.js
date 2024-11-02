import Template from '#root/modules/template.js';

class Page extends Template {
  constructor() {
    super('elems/page');
    this.set('content', '');
    this.set('description', '');
    this.set('h1', '');
    this.set('title', '');
  }

  async render() {
    if (!this.get('title')) {
      this.set('title', this.get('h1'));
    }
    return super.render();
  }
}

export default Page;
