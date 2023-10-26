const fileInput = document.querySelector('#imgFile');
const imgDescInput = document.querySelector('#imgDesc');
const form = document.querySelector('form');


form.addEventListener('submit', (event) => {
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

    window.location.href = "/"
});



async function loadin(){
    let data = await fetch("/api/getMsg/0")
    return data
}



function createReactTree(data){
    return data.map((data, i) => (
        <div key={i} className="showUpFrame">
            <div className="showUpBlock">
                <div className="showUpDesc">{data.msg}</div>
                <div className="showUpImg">
                    <img className="showUpImgTarget" src="https://brokenbucketgijoe.s3.us-west-2.amazonaws.com/"{data.img_url}/>
                </div>
            </div>
        </div>
    ))
}


// 監聽事件
document.addEventListener("DOMContentLoaded", async () => {
    let data = await loadin()
    console.log(data)

    createReactTree(data)

    ReactDOM.render(
        <Menu recipes={data} title="Delicious Recipes" />,
        document.getElementById("root")
    );
})