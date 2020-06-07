import React, { Component } from 'react';
import './App.css';
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

const particleOptions = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
}
const app = new Clarifai.App({
    apiKey: '4b0966cfcb344a41817c4d57f8825305'
});

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imgUrl: '',
            box: {},
            route: 'signin'
        }
    }

    calculateFaceLocation = (data) => {
        // this.setState({ box: data.outputs[0].data.regions[0].region_info.bounding_box });
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - clarifaiFace.right_col * width,
            bottomRow: height - clarifaiFace.bottom_row * height
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box})
        console.log(box);
    }

    onInputChange = (event) => {
        console.log(event.target.value);
        this.setState({input: event.target.value})
    }

    onRouteChange = (route) => {
        this.setState({route: route});
    }

    onButtonSubmit = () => {
        console.log('Click submit');
        this.setState({imgUrl: this.state.input})
        app.models
            .predict(Clarifai.FACE_DETECT_MODEL, this.state.input, {language: 'en'})
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="App">
                <Particles className='particles'
                           params={particleOptions}/>
                <Navigation onRouteChange={this.onRouteChange}/>
                {this.state.route === 'signin'
                    ? <Signin onRouteChange={this.onRouteChange}/>
                    : <div>
                        <Logo/>
                        <Rank/>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}/>
                        <FaceRecognition box={this.state.box} imgUrl={this.state.imgUrl}/>
                    </div>
                }
            </div>
        );
    }
}

export default App;
