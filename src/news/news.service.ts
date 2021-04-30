import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsDto } from './dto/news-dto';
import { CacheService } from '../cache/cache.service';
import { News } from './entities/news.entity';
import fs from 'fs';
import { S3 } from 'aws-sdk';
import { AwsService } from 'src/aws/aws.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class NewsService {
  constructor(
    private cacheService: CacheService,
    private filesService: FilesService,
  ) {}
  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  async findAll(): Promise<NewsDto[]> {
    // const cachedNews: NewsDto[] = await this.cacheService.get('news');
    // if (cachedNews) return cachedNews;

    const news: NewsDto[] = [];
    const html = await this.getHtml();
    const $ = cheerio.load(html.data);
    const $bodyList = $('section.article-list-content').children(
      'div.list-block',
    );
    const imageUrls = [];
    const urlPrefix = 'http://www.newspenguin.com/news';
    await $bodyList.each(async (i, elem) => {
      if (i > 1) return;
      const imageArray = $(elem).find('.list-image').attr('style').split('(.');
      imageArray[0] = urlPrefix;
      imageArray[1] = imageArray[1].slice(0, -1);
      const image = imageArray.join('');
      if (image) imageUrls.push(image);
      const newsInfoArray = $(elem)
        .find('.list-dated')
        .text()
        .trim()
        .split(' | ');
      const url =
        urlPrefix.replace('/news', '') +
        $(elem).find('.list-titles a').attr('href').trim();
      news[i] = {
        title: $(elem).find('strong').text(),
        image,
        summary: $(elem).find('.list-summary a').text().trim(),
        writer: newsInfoArray[1],
        writtenAt: new Date(newsInfoArray[2]),
        url,
      };
      console.log('response.data.read()', news);
    });
    console.log(news);
    await this.cacheService.set('news', news);
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        await this.filesService.imageToAws({
          fileUrl: imageUrl,
          fileName: 'testname',
        });
      }),
    );
    return news;
  }
  async getHtml() {
    try {
      return await axios.get(
        'http://www.newspenguin.com/news/articleList.html?view_type=sm',
      );
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
