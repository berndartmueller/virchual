import { h } from 'preact';
import { Virchual, VirchualSlide } from '@virchual/preact/dist';

function App() {
  return (
    <div>
      <h1>Hello World!</h1>

      <Virchual id="slider">
        <VirchualSlide
          html={`
            <picture>
              <source
                type="image/jpeg"
                data-srcSet="
              https://source.unsplash.com/7EsFOzUoIzU/400x265,
              https://source.unsplash.com/7EsFOzUoIzU/800x530 2x
            "
              />
              <img
                data-src="https://source.unsplash.com/7EsFOzUoIzU/400x265"
                src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
              />
            </picture>
          `}
        />
      </Virchual>
    </div>
  );
}

export default App;
