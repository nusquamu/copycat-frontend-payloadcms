import Meta from '@components/Meta';
import { dummyBody } from '../../../public/styleguideData';
import { BasicHero } from '@root/heros/Basic';
import React, { Fragment } from 'react';
import NextHead from 'next/head';
import Blocks from '@root/layout/Blocks';

const ContentBlockDemo = () => {
  return (
    <Fragment>
      <Meta
        title="Content Block"
      />
      <NextHead>
        <meta
          key="robots"
          name="robots"
          content="noindex,follow"
        />
        <meta
          key="googlebot"
          name="googlebot"
          content="noindex,follow"
        />
      </NextHead>
      <BasicHero
        richText={[
          {
            type: 'p',
            children: [
              {
                type: 'link',
                url: '/styleguide',
                children: [{
                  text: `Styleguide`,
                }]
              },
              {
                type: 'span',
                children: [{
                  text: ' — Block'
                }]
              }
            ]
          },
          {
            type: 'h1',
            children: [{
              text: 'Content Block',
            }]
          }
        ]}
      />
      <Blocks
        blocks={[
          {
            blockType: 'content',
            blockName: '',
            columns: [
              {
                width: 'oneThird',
                richText: [
                  dummyBody
                ]
              },
              {
                width: 'oneThird',
                richText: [
                  dummyBody
                ]
              },
              {
                width: 'oneThird',
                richText: [
                  dummyBody
                ]
              }
            ]
          },
          {
            blockType: 'content',
            blockName: '',
            columns: [
              {
                width: 'half',
                richText: [
                  dummyBody
                ]
              },
              {
                width: 'half',
                richText: [
                  dummyBody
                ]
              },
            ]
          },
          {
            blockType: 'content',
            blockName: '',
            columns: [
              {
                width: 'twoThirds',
                richText: [
                  dummyBody
                ]
              },
              {
                width: 'oneThird',
                richText: [
                  dummyBody
                ]
              },
            ]
          }
        ]}
      />
    </Fragment>
  )
}

export default ContentBlockDemo;
