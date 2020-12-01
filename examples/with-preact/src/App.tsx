import { h } from 'preact';
import { Virchual, VirchualSlide } from '@virchual/preact';

import '@virchual/preact/dist/index.css';

function App() {
  return (
    <div>
      <h1>Virchual - Example with Preact</h1>

      <Virchual>
        <VirchualSlide
          html={`
            <picture>
              <source
                type="image/jpeg"
                srcset="https://source.unsplash.com/L7hI4WkbEZY/400x265, https://source.unsplash.com/L7hI4WkbEZY/800x530 2x" />
              <img src="https://source.unsplash.com/L7hI4WkbEZY/400x265" itemprop="image"/>
            </picture>
          `}
        />

        <VirchualSlide
          html={`
            <picture>
              <source
                type="image/jpeg"
                srcset="https://source.unsplash.com/7EsFOzUoIzU/400x265, https://source.unsplash.com/7EsFOzUoIzU/800x530 2x" />
              <img src="https://source.unsplash.com/7EsFOzUoIzU/400x265" itemprop="image"/>
            </picture>
          `}
        />
      </Virchual>
    </div>
  );
}

export default App;
