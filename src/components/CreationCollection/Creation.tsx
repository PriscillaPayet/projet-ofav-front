import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import RessourceURL from '../Ressources/RessourceURL';
import RessourceText from '../Ressources/RessourceText';
import { ICategory, ILog } from '../../@types/interface';

function Creation({ isLogged }: ILog) {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [ressource, setRessource] = useState<
    { metadata: any; content: string; type: number }[]
  >([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ICategory[]>([]);
  const [published, setPublished] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedImageBlob, setSelectedImageBlob] = useState<
    Blob | undefined
  >();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle changes in the 'content' input field
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  // handle changes in the selected image file input
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageBlob(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };

  // function to add a resource (URL or plain text) to 'ressource' state
  const addRessource = async () => {
    if (content.trim() !== '') {
      // check if the content is a URL or plain text
      const isUrl = content.match(/^(https?:\/\/|www\.)\S+/i);

      if (isUrl) {
        try {
          const result = await axios.get(
            `https://jsonlink.io/api/extract?url=${content}`
          );
          const updatedMetadata = result.data;

          // add the resource to 'ressource' state with metadata
          setRessource([
            ...ressource,
            { metadata: updatedMetadata, type: 0, content },
          ]);
          setContent('');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            "Une erreur s'est produite lors de la récupération des métadonnées :",
            error
          );
        }
      } else {
        // It's plain text, add as a resource without fetching metadata
        setRessource([...ressource, { metadata: null, type: 1, content }]);
        setContent('');
      }
    }
  };

  // handle Enter key press in the 'content' input field to add a resource
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addRessource();
    }
  };

  // Get the 'id' from session storage
  const id = sessionStorage.getItem('id');

  // handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // if is Submitting -> exit
    if (isSubmitting) {
      return;
    }
    // if is not submiting -> set is submiting
    setIsSubmitting(true);
    // get the authorization token from session storage
    const authToken = sessionStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    };
    if (authToken && isLogged) {
      // prepare form data
      const formData: any = {
        title,
        description,
        published,
        category: selectedCategoryId,
        ressource,
        user: id,
        picture: '',
      };

      if (selectedImageBlob) {
        // if an image is selected, convert it to base64 string
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
          if (event.target && event.target.result) {
            const base64Image = event.target.result.toString();
            formData.picture = base64Image;

            try {
              // submit the form data to the server
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const result = await axios.post(
                'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/add',
                formData,
                config
              );
              // navigate to the 'collections' page after successful submission
              navigate('/collections');
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error:', error);
            }
          }
        };
        fileReader.readAsDataURL(selectedImageBlob);
      } else {
        // If no image is selected, submit the form without the picture data
        try {
          const result = await axios.post(
            'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/card/add',
            formData,
            config
          );
          navigate('/collections');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error:', error);
        } finally {
          // Reset the 'isSubmitting' state after the request
          setIsSubmitting(false);
        }
      }
    }
  };

  // fetch categories from the server using an effect
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await axios.get(
          'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/api/v1/category/all'
        );
        const categoriesArray = result.data.categories;
        setCategory(categoriesArray);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "Une erreur s'est produite lors de la récupération des collections:",
          error
        );
      }
    };
    // call the 'fetchCategories' function to fetch categories
    fetchCategories();
  }, []);

  // handle category change in the dropdown
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // parse the selected value to an integer and set it in state
    setSelectedCategoryId(parseInt(event.target.value, 10));
  };

  // Delete a resource from ressource state
  const deleteResource = (index: number) => {
    // create a copy of 'ressource' and remove the specified resource
    const updatedResources = [...ressource];
    updatedResources.splice(index, 1);
    // update 'ressource' state with the modified array
    setRessource(updatedResources);
  };

  // set selectedCategory when selectedCategoryId changes
  useEffect(() => {
    // Find the selected category from the 'category' state
    const categoryFound = category.find((cat) => cat.id === selectedCategoryId);
    // Set 'selectedCategory' to the found category or null if not found
    setSelectedCategory(categoryFound || null);
  }, [selectedCategoryId, category]);

  return (
    <div className="w-11/12 p-1 my-7 pb-3 shadow-2xl mx-auto flex flex-col md:grid md:grid-cols-3 md:gap-4">
      <div className="w-full md:w-2/3 mx-auto md:col-span-1">
        <section className="my-5 mb-2 mx-auto md:max-w-md">
          <label
            htmlFor="HeadlineAct"
            className="block text-sm font-medium text-gray-900"
          >
            Vous souhaitez que votre collection soit:{' '}
          </label>
          <select
            value={published}
            name="HeadlineAct"
            id="HeadlineAct"
            className="mt-1.5 mb-5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
            onChange={(event) => setPublished(parseInt(event.target.value, 10))}
          >
            <option id="1" value="0">
              Privée
            </option>
            <option id="2" value="1">
              Publique
            </option>
          </select>
        </section>
        {/* <section className="flex justify-center mb-5">
          <p>Privée</p>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={checkedPublished}
              className="mx-2 appearance-none w-9 focus:outline-none checked:bg-blue-300 h-5 bg-gray-300 rounded-full before:inline-block before:rounded-full before:bg-blue-500 before:h-4 before:w-4 checked:before:translate-x-full shadow-inner transition-all duration-300 before:ml-0.5"
              onChange={(event) => setCheckedPublished(event.target.checked)}
            />
          </div>
          <p>Publique</p>
        </section> */}
        <section className="mb-2 mx-auto md:max-w-md">
          <label
            htmlFor="HeadlineAct"
            className="block text-sm font-medium text-gray-900"
          >
            Catégorie:
          </label>
          <select
            value={selectedCategory?.id || ''}
            name="HeadlineAct"
            id="HeadlineAct"
            className="mt-1.5 mb-5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
            onChange={handleCategoryChange}
          >
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </section>
        <section className="mb-3">
          <div className="mx-auto mb-7 max-w-md">
            <label
              htmlFor="example1"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sélectionnez la photo de la collection
            </label>
            <input
              id="picture"
              type="file"
              accept="image/png, image/jpeg"
              className="text-gray-700 mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-cyan-700 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-60"
              onChange={handleImageChange}
            />
          </div>
        </section>
        <section className="md:max-w-md mx-auto mb-2">
          <input
            className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>
        <section className="mb-8 md:max-w-md mx-auto">
          <input
            className="mt-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-full"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting} // Désactiver le bouton lors de la soumission
            className={`rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring active:bg-cyan-700 disabled:opacity-50 ${
              isSubmitting ? 'pointer-events-none' : ''
            }`}
            onClick={handleSubmit}
          >
            Créer ma collection
          </button>
        </div>
      </div>
      <div className="w-full mx-auto md:col-span-2">
        <div className="flex items-center mx-auto mb-5 w-full justify-between md:max-w-2xl">
          <input
            type="text"
            placeholder="URL du lien ou texte"
            value={content}
            className="my-1.5 rounded-lg border-gray-300 text-gray-700 sm:text-sm flex-grow"
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            onClick={addRessource}
            className="rounded-full p-1 bg-cyan-700 text-white mx-1 px-1"
          >
            <svg
              width="31px"
              height="31px"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#ffffff"
            >
              <path
                d="M8 12h4m4 0h-4m0 0V8m0 4v4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {ressource.map((item, index) => (
          <div key={index}>
            {item.metadata ? (
              <RessourceURL
                url={item.metadata.url}
                images={item.metadata.images}
                title={item.metadata.title}
                description={item.metadata.description}
                onDelete={() => deleteResource(index)}
              />
            ) : (
              <RessourceText
                text={item.content}
                onDelete={() => deleteResource(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Creation;
