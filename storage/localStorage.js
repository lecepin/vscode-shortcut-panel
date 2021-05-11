class LocalStorage {
  constructor(context, key = "lp-shortcut-panel") {
    this.context = context;
    this.key = key;
  }

  async setValue(key, value) {
    const allValue = this.getAllValue(false);

    return await this.context.globalState.update(this.key, {
      ...allValue,
      [key]: value,
    });
  }

  async remove(key) {
    const allValue = this.getAllValue(false);

    delete allValue[key];
    return await this.context.globalState.update(this.key, allValue);
  }

  async removeAll() {
    return await this.context.globalState.update(this.key, {});
  }

  getValue(key) {
    const allValue = this.getAllValue(false);

    return allValue ? allValue[key] : undefined;
  }

  getAllValue(isArray = true) {
    const allValue = this.context.globalState.get(this.key);

    if (isArray) {
      return allValue ? Object.keys(allValue).map((key) => allValue[key]) : [];
    }

    return allValue ? allValue : {};
  }
}

module.exports = LocalStorage;
