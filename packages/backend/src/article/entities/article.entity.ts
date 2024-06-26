import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Author } from '../../author/entities/author.entity';

@ObjectType()
export class Article {
  @Field(() => ID, { description: 'The id of the article' })
  id: string;

  @Field(() => String, { description: 'The title of the article' })
  title: string;

  @Field(() => String, { description: 'The content of the article' })
  content: string;

  @Field(() => Boolean, { description: 'The flag to publish the article' })
  published: boolean;

  @Field(() => Author, { description: 'The author of the article' })
  author: Author;

  @Field(() => Date, { description: 'The creation date of the article' })
  createdAt: string;

  @Field(() => Date, { description: 'The updated date of the article' })
  updatedAt: string;
}
