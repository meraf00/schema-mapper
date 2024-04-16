import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  enumFromValue<T extends Record<string, string>>(val: string, _enum: T) {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(
      (k) => _enum[k] === val,
    );
    if (!enumName) throw Error();
    return _enum[enumName];
  }
}
