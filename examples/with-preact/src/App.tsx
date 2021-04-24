import { Virchual, VirchualSlide } from '@virchual/preact';
import { h } from 'preact';
import 'virchual/dist/virchual.css';

function App() {
  return (
    <div>
      <h1>Virchual - Example with Preact</h1>

      <Virchual>
        <VirchualSlide>
          <picture>
            <source
              type="image/jpeg"
              srcset="https://source.unsplash.com/L7hI4WkbEZY/400x265, https://source.unsplash.com/L7hI4WkbEZY/800x530 2x"
            />
            <img src="https://source.unsplash.com/L7hI4WkbEZY/400x265" itemProp="image" />
          </picture>
        </VirchualSlide>

        <VirchualSlide>
          <picture>
            <source
              type="image/jpeg"
              srcset="https://source.unsplash.com/7EsFOzUoIzU/400x265, https://source.unsplash.com/7EsFOzUoIzU/800x530 2x"
            />
            <img src="https://source.unsplash.com/7EsFOzUoIzU/400x265" itemProp="image" />
          </picture>
        </VirchualSlide>

        <VirchualSlide>
          <picture>
            <source
              type="image/jpeg"
              srcset="https://source.unsplash.com/M2FEVCu4Osw/400x265, https://source.unsplash.com/M2FEVCu4Osw/800x530 2x"
            />
            <img src="https://source.unsplash.com/M2FEVCu4Osw/400x265" itemProp="image" />
          </picture>
        </VirchualSlide>
      </Virchual>
    </div>
  );
}

export default App;
