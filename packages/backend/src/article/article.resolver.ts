import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => Article)
  createArticle(@Args('createArticleInput') createArticleInput: CreateArticleInput) {
    return this.articleService.create(createArticleInput);
  }

  @Query(() => [Article], { name: 'articles' })
  findAll() {
    return this.articleService.findAll();
  }

  @Query(() => Article, { name: 'article' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.articleService.findOne(id);
  }

  @Mutation(() => Article)
  updateArticle(@Args('updateArticleInput') updateArticleInput: UpdateArticleInput) {
    return this.articleService.update(updateArticleInput.id, updateArticleInput);
  }

  @Mutation(() => Article)
  removeArticle(@Args('id', { type: () => String }) id: string) {
    return this.articleService.remove(id);
  }
}
