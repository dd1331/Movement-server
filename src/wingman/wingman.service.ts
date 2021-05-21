import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WingmanService {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}
  private readonly logger = new Logger(WingmanService.name);

  // @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_HOUR)
  async crawlInstizFreeBoard() {
    this.logger.debug(
      `crawlInstizFreeBoard started ${WingmanService.name} ${Date.now()}`,
    );
    const listUrl = 'https://www.instiz.net/name?category=1';
    const html = await this.getHtml(listUrl);
    const posts = await this.getPostsValues(html);
    // TODO temp
    await this.createPostsByWingman(posts);
  }

  private async getPostsValues(html) {
    const $ = cheerio.load(html.data);
    const $bodyList = $('#mainboard').children().children();
    const urlList = this.getUrlList($, $bodyList);
    return await Promise.all(
      urlList.map(async (url) => {
        const html = await this.getHtml(url);
        const $ = cheerio.load(html.data);
        const title = $('.tb_top').find('#nowsubject a').text().trim();
        const content = $('.memo_content');
        const contentStr = content.text().trim();
        let src = '';
        $('.memo_content')
          .find('p')
          .each((index, e) => {
            if (index >= 1) return;
            if ($(e).find('img').attr('src'))
              src = $(e).find('img').attr('src');
          });
        const result = { title, content: contentStr, src };
        return result;
      }),
    );
  }

  private async createPostsByWingman(
    posts: { title: string; content: string; src?: string }[],
  ) {
    const categories = ['free', 'exercise', 'enviroment', 'meetup'];
    const users: User[] = await this.usersService.findWingmanUsers();
    const wingman: User = users[Math.floor(Math.random() * users.length)];
    // const images = [];
    await Promise.all(
      posts.map(async (post) => {
        // if (post.src) this.uploadImage(post.src);
        // if (post.src) images.push(post.src);
        const dto: CreatePostDto = {
          ...post,
          poster: wingman.id.toString(),
          category: categories[Math.floor(Math.random() * categories.length)],
        };
        return await this.postsService.createPostByWingman(dto);
      }),
    );
    // TODO implement uploadImage
    // await Promise.all(images.map(async (url) => await this.uploadImage(url)));
  }
  getUrlList($, $bodyList) {
    const urlPrefix = 'https://www.instiz.net';
    const urlList = [];

    $bodyList.each((i, elem) => {
      try {
        const isLocked = $(elem).find('.listsubject .minitext').html();
        const url =
          urlPrefix + $(elem).find('.listsubject a').attr('href').slice(2);
        if (!isLocked) urlList.push(url);
      } catch (error) {}
    });
    return urlList;
  }
  async getHtml(url) {
    try {
      return await axios.get(url);
    } catch (error) {}
  }
}
