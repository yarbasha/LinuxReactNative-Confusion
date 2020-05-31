import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView, Modal, Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
	return {
		dishes: state.dishes,
		comments: state.comments,
		favorites: state.favorites
	}
};

const mapDispatchToProps = dispatch => ({
	postFavorite: dishId => dispatch(postFavorite(dishId)),
	postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});


function RenderDish(props) {

	const dish = props.dish;

	handleViewRef = ref => view = ref;

	const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
		if (dx < -200) return true;
		else return false;
	};

	const recognizeComment = ({ moveX, moveY, dx, dy }) => {
		if (dx > 200) return true;
		else return false;
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: (e, gestureState) => {
			return true;
		},
		onPanResponderGrant: () => {
			view.rubberBand(1000)
				.then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
		},
		onPanResponderEnd: (e, gestureState) => {
			if (recognizeDrag(gestureState)) {
				Alert.alert(
					'Add to Favorites',
					'Are you sure you wish to add ' + dish.name + ' ?',
					[
						{
							text: 'cancel',
							onPress: () => console.log('Cancel pressed')
						},
						{
							text: 'ok',
							onPress: () => props.favorite ? console.log('Already favorite') : props.onPress()
						}
					]
				);
			}
			else if (recognizeComment(gestureState)) {
				props.showModal();
			}
			return true;
		}
	});

	const shareDish = (title, message, url) => {
		Share.share({
			title: title,
			message: title + ': ' + message + ' ' + url,
			url: url
		}, {
			dialogTitle: 'Share ' + title
		});
	};

	if (dish != null) {
		return (
			<Animatable.View useNativeDriver={true} animation="fadeInDown" duration={2000} delay={1000}
				ref={handleViewRef}
				{...panResponder.panHandlers}>
				<Card
					featuredTitle={dish.name}
					image={{ uri: baseUrl + dish.image }}>
					<Text style={{ margin: 10 }}>
						{dish.description}
					</Text>
					<View style={styles.cardIcons}>
						<Icon raised reverse name={props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
							onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()} />
						<Icon raised reverse name='pencil' type='font-awesome' color='#512DA8'
							onPress={() => props.showModal()} />
						<Icon raised reverse name='share' type='font-awesome' color='#51D2A8'
							onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
					</View>
				</Card>
			</Animatable.View>
		);
	}
	else {
		return (<View></View>);
	}
}

function RenderComments(props) {
	const comments = props.comments;
	const renderCommentItem = ({ item, index }) => {
		return (
			<View key={index} style={{ margin: 10 }}>
				<Text style={{ fontSize: 14, marginBottom: 5 }}>{item.comment}</Text>
				<Rating imageSize={12} style={{ alignItems: 'flex-start', marginBottom: 3 }} readonly startingValue={item.rating} />
				<Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date}</Text>
			</View>
		);
	}
	return (
		<Animatable.View useNativeDriver={true} animation="fadeInUp" duration={2000} delay={1000}>
			<Card title="Comments">
				<FlatList data={comments} renderItem={renderCommentItem}
					keyExtractor={item => item.id.toString()} />
			</Card>
		</Animatable.View>
	);
}
class DishDetail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rating: 5,
			author: '',
			comment: '',
			showModal: false
		}
	}

	toggleModal() {
		this.setState({ showModal: !this.state.showModal });
	}

	resetForm() {
		this.setState({
		});
	}

	handleComment() {
		const dishId = this.props.navigation.getParam('dishId', '');
		this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
		this.toggleModal();
	}

	markFavorite(dishId) {
		this.props.postFavorite(dishId);
	}
	static navigationOptions = {
		title: 'Dish Details'
	};

	render() {
		const dishId = this.props.navigation.getParam('dishId', '');
		return (
			<ScrollView>
				<RenderDish dish={this.props.dishes.dishes[+dishId]}
					favorite={this.props.favorites.some(el => el === dishId)}
					onPress={() => this.markFavorite(dishId)}
					showModal={() => this.toggleModal()} />
				<RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
				<Modal animationType='slide'
					transparent={false}
					visible={this.state.showModal}
					onDismiss={() => { this.toggleModal(); this.resetForm(); }}
					onRequestClose={() => { this.toggleModal(); this.resetForm(); }}>
					<View>
						<Rating showRating startingValue={this.state.rating}
							onFinishRating={(value) => this.setState({ rating: value })}
						/>
						<View style={styles.formRow}>
							<Input
								placeholder=" Author" containerStyle={styles.formRow}
								leftIcon={{ type: 'font-awesome', name: 'user-o' }}
								onChangeText={value => this.setState({ author: value })}
							/>
						</View>
						<View style={styles.formRow}>
							<Input
								placeholder=" Comment" containerStyle={styles.formRow}
								leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
								onChangeText={value => this.setState({ comment: value })}
							/>
						</View>
						<View style={styles.formRow}>
							<Button onPress={() => { this.handleComment(); }} color='#512DA8' title='Submit' />
						</View>
						<View style={styles.formRow}>
							<Button onPress={() => { this.toggleModal(); }} color='gray' title='Cancel' />
						</View>
					</View>
				</Modal>
			</ScrollView>
		);
	}
}
const styles = StyleSheet.create({
	formRow: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'row',
		margin: 30
	},
	cardIcons: {
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'row',
		margin: 0
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);