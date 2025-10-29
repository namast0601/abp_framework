import type { EntityDto } from '@abp/ng.core';

export interface AuthorLookupDto extends EntityDto<string> {
  name?: string;
}
