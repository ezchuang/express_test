const fileInput = document.querySelector('#imgFile');
const imgDescInput = document.querySelector('#imgDesc');
const form = document.querySelector('form');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();

    formData.append('imgDesc', imgDescInput.value); 
    formData.append('imgFile', fileInput.files[0]);

    fetch('/newPost', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('upload fail');
        }
    })
    .then(data => {
        console.log('upload success', data);
    })
    .catch(error => {
         console.error('upload fail', error);
    });

    await sleep(1000)
    window.location.href = "/"
});


async function loadin() {
    try {
        const response = await fetch("/api/getMsg/0");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}


function createReactTree(data) {
    return data.map((item, i) => {
        const imgSrc = `https://d2ndnbzl6dhb4z.cloudfront.net/${item.img_url}`;
        return React.createElement('div', { key: i, className: 'showUpFrame' },
            React.createElement('div', { className: 'showUpBlock' }, [
                React.createElement('div', { key: 'desc', className: 'showUpDesc' }, item.msg),
                React.createElement('div', { key: 'img', className: 'showUpImg' }, [
                    React.createElement('img', {
                        key: 'imgTarget',
                        className: 'showUpImgTarget',
                        src: imgSrc,
                        alt: 'Image',
                    }),
                ]),
            ])
        );
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await loadin();
        console.log(data);

        const reactTree = createReactTree(data.data);

        ReactDOM.render(
            React.createElement('div', null, reactTree),
            document.getElementById('root')
        );
    } catch (error) {
        console.error('An error occurred:', error);
    }
});