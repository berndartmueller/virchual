const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="wrapper homeWrapper">{props.children}</div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <svg width="300" viewBox="0 0 799 193" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="-52%" x2="50%" y2="210.6%" id="a">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="-111.3%" x2="50%" y2="253.9%" id="b">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="-107.6%" x2="50%" y2="246.1%" id="c">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="-52.7%" x2="50%" y2="211.1%" id="d">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="-114.9%" x2="50%" y2="253.6%" id="e">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="-108.4%" x2="50%" y2="246.8%" id="f">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="-52.9%" x2="50%" y2="211.3%" id="g">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="84%" y1="-.7%" x2="-104.9%" y2="161.8%" id="h">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="96.5%" y1="-18.6%" x2="-30.9%" y2="136%" id="i">
              <stop stop-color="#ED3557" offset="0%" />
              <stop stop-color="#8A479A" offset="100%" />
            </linearGradient>
            <linearGradient x1="43.9%" y1="20.6%" x2="73.6%" y2="90.3%" id="j">
              <stop stop-color="#ED3557" stop-opacity="0" offset="0%" />
              <stop stop-color="#B43F7E" stop-opacity=".6" offset="40.9%" />
              <stop stop-color="#8A479A" stop-opacity=".9" offset="100%" />
            </linearGradient>
          </defs>
          <g fill-rule="nonzero" fill="none">
            <path
              d="M250 39.9c0 17.8-27 17.8-27 0 0-18 27-18 27 0zm-25 25.8v93.2h23V65.7h-23z"
              fill="url(#a)"
              transform="translate(0 -1)"
            />
            <path
              d="M290 66l1.7 10.8c7.1-11.5 16.7-13.2 26.2-13.2 9.4 0 18.8 3.7 23.9 8.8l-10.4 20a23 23 0 00-16.6-6.1c-12 0-23.1 6.4-23.1 23.5v49h-23V66H290z"
              fill="url(#b)"
              transform="translate(0 -1)"
            />
            <path
              d="M430 147a47.8 47.8 0 01-35.7 14.6c-27 0-49.4-16.1-49.4-49 0-33 22.4-49.2 49.3-49.2A44 44 0 01427.8 77l-14.6 15.3a28.1 28.1 0 00-18.6-7.4c-15.4 0-26.7 11.3-26.7 27.5 0 17.7 12 27.2 26.3 27.2 7.6.3 15-2.5 20.5-7.8l15.4 15z"
              fill="url(#c)"
              transform="translate(0 -1)"
            />
            <path
              d="M463.3 27v51.6a34.3 34.3 0 0129-13.9c26.3 0 38 17.9 38 45.2v49h-23V110c0-17-8.9-24.1-21.1-24.1-13.6 0-23 11.5-23 25.4V159h-23V27h23z"
              fill="url(#d)"
              transform="translate(0 -1)"
            />
            <path
              d="M571.3 66v48.6c0 14.1 7.7 24.8 22.5 24.8 14 0 23.7-11.8 23.7-26V66h22.8v93h-20.6l-1.5-12.6a41.2 41.2 0 01-31.4 14c-22.3 0-38.5-16.8-38.5-45.6V66h23z"
              fill="url(#e)"
              transform="translate(0 -1)"
            />
            <path
              d="M734.2 66h22V159h-21.6l-1.2-13.6c-5.2 11-19.7 16.2-30 16.3-27.6.2-48-16.7-48-49.3 0-32 21.4-48.8 48.5-48.6 12.4 0 24.3 5.9 29.5 15l.8-12.7zm-55.8 46.3c0 17.7 12.3 28.3 27.5 28.3 36.2 0 36.2-56.3 0-56.3-15.2 0-27.5 10.4-27.5 28z"
              fill="url(#f)"
              transform="translate(0 -1)"
            />
            <path fill="url(#g)" d="M798.4 27.2V159h-22.8V27.2z" transform="translate(0 -1)" />
            <path
              d="M66.6 1.6l60.3 103.8 18.2 31.2 13.6-23.4L223.6 1.6h-157zM121 32.8h48l-24 41.4-24-41.4z"
              fill="url(#h)"
              transform="translate(0 -1)"
            />
            <path
              fill="url(#i)"
              d="M.5 1.6l111.6 191.8 33-56.8 13.6-23.4-27.3-15.6-4.5 7.8-14.8 25.6L36.8 1.6z"
              transform="translate(0 -1)"
            />
            <path fill="url(#j)" d="M145 74.2L127 105.4 66.6 1.6 121 32.8z" transform="translate(0 -1)" />
          </g>
        </svg>
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        <small>{props.tagline}</small>
      </h2>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/undraw_monitor.svg`} />
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} />
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
        <GridBlock align="center" contents={props.children} layout={props.layout} />
      </Container>
    );

    const FeatureCallout = () => (
      <div className="productShowcaseSection paddingBottom" style={{ textAlign: 'center' }}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const Demo = () => (
      <div className="demoSection paddingBottom" style={{ textAlign: 'center' }}>
        <div className="virchual image-swiper">
          <div className="virchual__frame" style={{ height: '100%' }}>
            <div className="virchual__slide">
              <picture>
                <source
                  type="image/webp"
                  srcset="
                    https://i.findheim.at/images/sm/zatt2jPaRYBCocC0BJvE4.webp,
                    https://i.findheim.at/images/md/zatt2jPaRYBCocC0BJvE4.webp 2x
                  "
                />
                <source
                  type="image/jpeg"
                  srcset="
                    https://i.findheim.at/images/sm/zatt2jPaRYBCocC0BJvE4.jpg,
                    https://i.findheim.at/images/md/zatt2jPaRYBCocC0BJvE4.jpg 2x
                  "
                />
                <img src="https://i.findheim.at/images/md/zatt2jPaRYBCocC0BJvE4.jpg" itemprop="image" />
              </picture>
            </div>
          </div>

          <button type="button" data-controls="prev" tabIndex="-1" aria-controls="" className="virchual__control virchual__control--prev">
            <svg viewBox="0 0 16 16" role="presentation" aria-hidden="true" focusable="false">
              <path d="m10.8 16c-.4 0-.7-.1-.9-.4l-6.8-6.7c-.5-.5-.5-1.3 0-1.8l6.8-6.7c.5-.5 1.2-.5 1.7 0s .5 1.2 0 1.7l-5.8 5.9 5.8 5.9c.5.5.5 1.2 0 1.7-.2.3-.5.4-.8.4"></path>
            </svg>
          </button>

          <button type="button" data-controls="next" tabIndex="-1" aria-controls="" className="virchual__control virchual__control--next">
            <svg viewBox="0 0 16 16" role="presentation" aria-hidden="true" focusable="false">
              <path d="m5.3 16c .3 0 .6-.1.8-.4l6.8-6.7c.5-.5.5-1.3 0-1.8l-6.8-6.7c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l5.8 5.9-5.8 5.9c-.5.5-.5 1.2 0 1.7.2.3.5.4.9.4"></path>
            </svg>
          </button>
        </div>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: 'This is the content of my feature',
            title: 'Feature One',
          },
          {
            content: 'The content of my second feature',
            title: 'Feature Two',
          },
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />

        <div className="mainContainer">
          <Demo />
          <Features />
          <FeatureCallout />
          <TryOut />
        </div>
      </div>
    );
  }
}

module.exports = Index;
