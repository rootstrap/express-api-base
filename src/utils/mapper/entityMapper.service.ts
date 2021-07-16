import {
  ClassConstructor,
  classToPlain,
  plainToClass
} from 'class-transformer';

export class EntityMapper {
  public static mapTo<T, V>(
    destinationClass: ClassConstructor<T>,
    entity: V
  ): T {
    const entityJson = classToPlain(entity);
    return plainToClass(destinationClass, entityJson);
  }
}
