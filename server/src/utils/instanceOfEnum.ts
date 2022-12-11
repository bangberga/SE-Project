function instanceOfEnum(e: { [key: string]: string }, key: string): boolean {
  return Object.values(e).includes(key);
}

export default instanceOfEnum;
